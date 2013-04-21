package com.fem.google.cloud.endpoints;

import com.fem.google.cloud.endpoints.PMF;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JDOCursorHelper;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@Api(name = "expenseentityendpoint")
public class ExpenseEntityEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	public CollectionResponse<ExpenseEntity> listExpenseEntity(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<ExpenseEntity> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(ExpenseEntity.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<ExpenseEntity>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (ExpenseEntity obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<ExpenseEntity> builder().setItems(execute)
				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	public ExpenseEntity getExpenseEntity(@Named("id") String id) {
		PersistenceManager mgr = getPersistenceManager();
		ExpenseEntity expenseentity = null;
		try {
			expenseentity = mgr.getObjectById(ExpenseEntity.class, id);
		} finally {
			mgr.close();
		}
		return expenseentity;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param expenseentity the entity to be inserted.
	 * @return The inserted entity.
	 */
	public ExpenseEntity insertExpenseEntity(ExpenseEntity expenseentity) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (containsExpenseEntity(expenseentity)) {
				throw new EntityExistsException("Object already exists");
			}
			mgr.makePersistent(expenseentity);
		} finally {
			mgr.close();
		}
		return expenseentity;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param expenseentity the entity to be updated.
	 * @return The updated entity.
	 */
	public ExpenseEntity updateExpenseEntity(ExpenseEntity expenseentity) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (!containsExpenseEntity(expenseentity)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			mgr.makePersistent(expenseentity);
		} finally {
			mgr.close();
		}
		return expenseentity;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 * @return The deleted entity.
	 */
	public ExpenseEntity removeExpenseEntity(@Named("id") String id) {
		PersistenceManager mgr = getPersistenceManager();
		ExpenseEntity expenseentity = null;
		try {
			expenseentity = mgr.getObjectById(ExpenseEntity.class, id);
			mgr.deletePersistent(expenseentity);
		} finally {
			mgr.close();
		}
		return expenseentity;
	}

	private boolean containsExpenseEntity(ExpenseEntity expenseentity) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(ExpenseEntity.class,
					expenseentity.getExpenseEntityId());
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