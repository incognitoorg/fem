package com.fem.google.cloud.endpoints;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.persistence.EntityNotFoundException;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JDOCursorHelper;

@Api(name = "groupendpoint")
public class GroupEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	public CollectionResponse<Group> listGroup(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<Group> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(Group.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<Group>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (Group obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<Group> builder().setItems(execute)
				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	public Group getGroup(@Named("id") String id) {
		PersistenceManager mgr = getPersistenceManager();
		Group group = null;
		ArrayList<User> alMembers = null;
		try {
			group = mgr.getObjectById(Group.class, id);
			
			alMembers = (ArrayList<User>)group.getMembers().clone();
			
			//TODO : Instead of using for loop, use a select query with in clause if available.
			for (Iterator iterator = group.getMembersIdList().iterator(); iterator.hasNext();) {
				String userId = (String) iterator.next();
				
				//TODO : To put this in transaction
				User objMember = new UserEndpoint().getUser(userId);
				alMembers.add(objMember);
				
			}
			for(IOU objIOU : group.getIouList()){
				objIOU.getFromUserId();//Cause The datastore does not support joins and therefore cannot honor requests to place related objects in the default fetch group. 
			}
		} finally {
			mgr.close();
		}
		group.setMembers(alMembers);
		return group;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param group the entity to be inserted.
	 * @return The inserted entity.
	 */
	public Group insertGroup(Group group) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			ArrayList<User> alMembersFromClient = group.getMembers();
			
			
			ArrayList<User> alTotalMembers = new ArrayList<User>();
			UserEndpoint userEndpoint = new UserEndpoint();
			for (Iterator<User> iterator = alMembersFromClient.iterator(); iterator.hasNext();) {
				User user = (User) iterator.next();
				if(user.getUserId()==null){
					//TODO : To put this in transaction
					user = userEndpoint.getOrInsertUser(user);
				}
				alTotalMembers.add(user);
			}
			
			
			ArrayList<String> alMembersIdList = new ArrayList<String>();
			group.setMembers(null);
			for (Iterator<User> iterator = alTotalMembers.iterator(); iterator.hasNext();) {
				User user = (User) iterator.next();
				alMembersIdList.add(user.getUserId());
			}
			//Pushing to databse since needs group id
			group = mgr.makePersistent(group);
			
			for (Iterator<User> iterator = alTotalMembers.iterator(); iterator.hasNext();) {
				User user = (User) iterator.next();
				GroupMemberMapping objGroupMemberMapping = new GroupMemberMapping();
				objGroupMemberMapping.setGroupId(group.getGroupId());
				objGroupMemberMapping.setUserId(user.getUserId());
				mgr.makePersistent(objGroupMemberMapping);
			}
			
			ArrayList<IOU> alIOU = this.generateIOUEntries(alTotalMembers, group);
			group.setIouList(alIOU);
			
			group = mgr.makePersistent(group);
			group.setMembersIdList(alMembersIdList);
			
		} finally {
			mgr.close();
		}
		return group;
	}

	
	private ArrayList<IOU> generateIOUEntries(ArrayList<User> allMembers, Group objGroup){
		
		ArrayList<IOU> alIOU = new ArrayList<IOU>();
		for (int i = 0; i < allMembers.size(); i++) {

			User fromUser = allMembers.get(i);
			
			for (int j = i+1; j < allMembers.size(); j++) {
				User toUser = allMembers.get(j);
				
				IOU objIOU = new IOU();
				objIOU.setGroupId(objGroup.getGroupId());
				objIOU.setFromUserId(fromUser.getUserId());
				objIOU.setToUserId(toUser.getUserId());
				objIOU.setAmount(0);
				alIOU.add(objIOU);
				//pm.makePersistent(objIOU);
			}
		}
		return alIOU;
		
	}
	
	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param group the entity to be updated.
	 * @return The updated entity.
	 */
	public Group updateGroup(Group group) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (!containsGroup(group)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			group.setMembers(null);//Removing members as they are not embedded.
			
			mgr.makePersistent(group);
		} finally {
			mgr.close();
		}
		return group;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 * @return The deleted entity.
	 */
	public Group removeGroup(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		Group group = null;
		try {
			group = mgr.getObjectById(Group.class, id);
			mgr.deletePersistent(group);
		} finally {
			mgr.close();
		}
		return group;
	}

	private boolean containsGroup(Group group) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(Group.class, group.getGroupId());
		} catch (javax.jdo.JDOObjectNotFoundException ex) {
			contains = false;
		} finally {
			mgr.close();
		}
		return contains;
	}

	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}

}
